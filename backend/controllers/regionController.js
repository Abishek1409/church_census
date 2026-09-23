const { body, validationResult } = require('express-validator');
const { Region, Member, User, UserRegion } = require('../models');
const { Op } = require('sequelize');

/**
 * Validation rules for creating a region
 */
const createRegionValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Region name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Region name must be between 2 and 100 characters'),
  body('type')
    .notEmpty().withMessage('Region type is required')
    .isIn(['VILLAGE', 'TOWN', 'DISTRICT']).withMessage('Region type must be VILLAGE, TOWN, or DISTRICT'),
  body('description')
    .optional()
    .trim()
];

/**
 * Validation rules for updating a region
 */
const updateRegionValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Region name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Region name must be between 2 and 100 characters'),
  body('type')
    .optional()
    .isIn(['VILLAGE', 'TOWN', 'DISTRICT']).withMessage('Region type must be VILLAGE, TOWN, or DISTRICT'),
  body('description')
    .optional()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value')
];

/**
 * POST /api/regions
 * Create a new region
 * Requires ADMINISTRATOR role
 * Automatically creates a field worker account with:
 * - username = region name
 * - password = <RegionName>@123
 * - assigns the region to that user
 */
const createRegion = async (req, res) => {
  const transaction = await Region.sequelize.transaction();
  
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const { name, type, description } = req.body;
    const trimmedName = name.trim();

    // Check for duplicate region name
    const existingRegion = await Region.findOne({
      where: { name: { [Op.iLike]: trimmedName } },
      transaction
    });

    if (existingRegion) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_REGION_NAME',
          message: 'A region with this name already exists'
        }
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({
      where: { username: trimmedName },
      transaction
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_USERNAME',
          message: 'A user with this region name as username already exists'
        }
      });
    }

    // Create region
    const region = await Region.create({
      name: trimmedName,
      type,
      description: description ? description.trim() : null,
      isActive: true
    }, { transaction });

    // Create field worker account with username = region name, password = <RegionName>@123
    const fieldWorkerPassword = `${trimmedName}@123`;
    const fieldWorker = await User.create({
      username: trimmedName,
      password: fieldWorkerPassword, // will be hashed by User model hook
      fullName: `${trimmedName} Field Worker`,
      role: 'FIELD_WORKER',
      isActive: true
    }, { transaction });

    // Assign the region to the field worker
    await UserRegion.create({
      userId: fieldWorker.id,
      regionId: region.id,
      assignedBy: req.user.userId
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      data: {
        region: {
          id: region.id,
          name: region.name,
          type: region.type,
          description: region.description,
          isActive: region.isActive,
          createdAt: region.createdAt
        },
        fieldWorker: {
          id: fieldWorker.id,
          username: fieldWorker.username,
          fullName: fieldWorker.fullName,
          role: fieldWorker.role,
          temporaryPassword: fieldWorkerPassword // Return password for admin to share with field worker
        }
      },
      message: 'Region and field worker account created successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Create region error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while creating region'
      }
    });
  }
};

/**
 * GET /api/regions
 * List all active regions
 * Requires authentication (all authenticated users can view)
 * For field workers, highlights their assigned regions
 */
const listRegions = async (req, res) => {
  try {
    const { role, userId } = req.user;

    // Fetch all active regions
    const regions = await Region.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'type', 'description', 'isActive', 'createdAt'],
      order: [['name', 'ASC']]
    });

    // If user is a field worker, get their assigned regions
    let assignedRegionIds = [];
    if (role === 'FIELD_WORKER') {
      const userRegions = await UserRegion.findAll({
        where: { userId },
        attributes: ['regionId']
      });
      assignedRegionIds = userRegions.map(ur => ur.regionId);
    }

    // Format response with assigned flag for field workers
    const regionsData = regions.map(region => ({
      id: region.id,
      name: region.name,
      type: region.type,
      description: region.description,
      isActive: region.isActive,
      createdAt: region.createdAt,
      isAssigned: role === 'FIELD_WORKER' ? assignedRegionIds.includes(region.id) : undefined
    }));

    return res.status(200).json({
      success: true,
      data: regionsData
    });

  } catch (error) {
    console.error('List regions error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching regions'
      }
    });
  }
};

/**
 * PUT /api/regions/:id
 * Update a region's information
 * Requires ADMINISTRATOR role
 * Allows updating: name, type, description, isActive
 */
const updateRegion = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const regionId = parseInt(req.params.id);
    const { name, type, description, isActive } = req.body;

    // Find region
    const region = await Region.findByPk(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REGION_NOT_FOUND',
          message: 'Region not found'
        }
      });
    }

    // If updating name, check for duplicates (excluding current region)
    if (name && name.trim() !== region.name) {
      const existingRegion = await Region.findOne({
        where: {
          name: { [Op.iLike]: name.trim() },
          id: { [Op.ne]: regionId }
        }
      });

      if (existingRegion) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_REGION_NAME',
            message: 'A region with this name already exists'
          }
        });
      }
    }

    // Update only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    await region.update(updateData);

    return res.status(200).json({
      success: true,
      data: {
        id: region.id,
        name: region.name,
        type: region.type,
        description: region.description,
        isActive: region.isActive,
        updatedAt: region.updatedAt
      },
      message: 'Region updated successfully'
    });

  } catch (error) {
    console.error('Update region error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating region'
      }
    });
  }
};

/**
 * DELETE /api/regions/:id
 * Delete a region (soft delete)
 * Requires ADMINISTRATOR role
 * Sets isActive to false
 * Prevents deletion if region has associated members
 */
const deleteRegion = async (req, res) => {
  try {
    const regionId = parseInt(req.params.id);

    // Find region
    const region = await Region.findByPk(regionId);
    if (!region) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REGION_NOT_FOUND',
          message: 'Region not found'
        }
      });
    }

    // Check if region has associated members
    const memberCount = await Member.count({
      where: { regionId }
    });

    if (memberCount > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'REGION_HAS_MEMBERS',
          message: `Cannot delete region. It has ${memberCount} associated member(s). Please reassign or remove members first.`
        }
      });
    }

    // Soft delete: set isActive to false
    await region.update({ isActive: false });

    return res.status(200).json({
      success: true,
      data: {
        id: region.id,
        name: region.name,
        isActive: region.isActive
      },
      message: 'Region deleted successfully'
    });

  } catch (error) {
    console.error('Delete region error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while deleting region'
      }
    });
  }
};

module.exports = {
  createRegion,
  createRegionValidation,
  listRegions,
  updateRegion,
  updateRegionValidation,
  deleteRegion
};
