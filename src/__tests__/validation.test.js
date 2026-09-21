import * as Yup from 'yup';

// Validation schema from AddMemberScreen
const memberValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  
  aadharNumber: Yup.string()
    .required('Aadhar number is required')
    .matches(/^[0-9]{12}$/, 'Aadhar number must be exactly 12 digits')
    .length(12, 'Aadhar number must be exactly 12 digits'),
  
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .length(10, 'Phone number must be exactly 10 digits'),
  
  community: Yup.string()
    .required('Community is required')
    .max(50, 'Community must be less than 50 characters'),
  
  subCaste: Yup.string()
    .required('Sub-caste is required')
    .max(50, 'Sub-caste must be less than 50 characters'),
  
  housingType: Yup.string()
    .required('Housing type is required')
    .oneOf(['Rent', 'Owned', 'Government Provided'], 'Invalid housing type'),
  
  address: Yup.string()
    .required('Address is required'),
  
  hasPatta: Yup.boolean(),
  
  occupation: Yup.string()
    .required('Occupation is required')
    .max(100, 'Occupation must be less than 100 characters'),
  
  income: Yup.number()
    .required('Income is required')
    .positive('Income must be a positive number')
    .typeError('Income must be a valid number'),
  
  educationQualification: Yup.string()
    .required('Education qualification is required')
    .max(100, 'Education qualification must be less than 100 characters'),
  
  rationCardNumber: Yup.string()
    .required('Ration card number is required')
    .max(20, 'Ration card number must be less than 20 characters'),
});

describe('Member Form Validation', () => {
  const validMemberData = {
    fullName: 'John Doe',
    aadharNumber: '123456789012',
    phoneNumber: '9876543210',
    community: 'Catholic',
    subCaste: 'Latin',
    housingType: 'Owned',
    address: '123 Main St, City',
    hasPatta: true,
    occupation: 'Teacher',
    income: 25000,
    educationQualification: 'Bachelor Degree',
    rationCardNumber: 'RC123456',
  };

  describe('Aadhar Number Validation', () => {
    it('should accept valid 12-digit Aadhar number', async () => {
      await expect(
        memberValidationSchema.validateAt('aadharNumber', { aadharNumber: '123456789012' })
      ).resolves.toBe('123456789012');
    });

    it('should reject Aadhar number with less than 12 digits', async () => {
      await expect(
        memberValidationSchema.validateAt('aadharNumber', { aadharNumber: '12345678901' })
      ).rejects.toThrow('Aadhar number must be exactly 12 digits');
    });

    it('should reject Aadhar number with more than 12 digits', async () => {
      await expect(
        memberValidationSchema.validateAt('aadharNumber', { aadharNumber: '1234567890123' })
      ).rejects.toThrow('Aadhar number must be exactly 12 digits');
    });

    it('should reject Aadhar number with non-numeric characters', async () => {
      await expect(
        memberValidationSchema.validateAt('aadharNumber', { aadharNumber: '12345678901A' })
      ).rejects.toThrow('Aadhar number must be exactly 12 digits');
    });

    it('should reject empty Aadhar number', async () => {
      await expect(
        memberValidationSchema.validateAt('aadharNumber', { aadharNumber: '' })
      ).rejects.toThrow('Aadhar number is required');
    });
  });

  describe('Phone Number Validation', () => {
    it('should accept valid 10-digit phone number', async () => {
      await expect(
        memberValidationSchema.validateAt('phoneNumber', { phoneNumber: '9876543210' })
      ).resolves.toBe('9876543210');
    });

    it('should reject phone number with less than 10 digits', async () => {
      await expect(
        memberValidationSchema.validateAt('phoneNumber', { phoneNumber: '987654321' })
      ).rejects.toThrow('Phone number must be exactly 10 digits');
    });

    it('should reject phone number with more than 10 digits', async () => {
      await expect(
        memberValidationSchema.validateAt('phoneNumber', { phoneNumber: '98765432101' })
      ).rejects.toThrow('Phone number must be exactly 10 digits');
    });

    it('should reject phone number with non-numeric characters', async () => {
      await expect(
        memberValidationSchema.validateAt('phoneNumber', { phoneNumber: '987654321A' })
      ).rejects.toThrow('Phone number must be exactly 10 digits');
    });
  });

  describe('Housing Type Validation', () => {
    it('should accept "Rent" as housing type', async () => {
      await expect(
        memberValidationSchema.validateAt('housingType', { housingType: 'Rent' })
      ).resolves.toBe('Rent');
    });

    it('should accept "Owned" as housing type', async () => {
      await expect(
        memberValidationSchema.validateAt('housingType', { housingType: 'Owned' })
      ).resolves.toBe('Owned');
    });

    it('should accept "Government Provided" as housing type', async () => {
      await expect(
        memberValidationSchema.validateAt('housingType', { housingType: 'Government Provided' })
      ).resolves.toBe('Government Provided');
    });

    it('should reject invalid housing type', async () => {
      await expect(
        memberValidationSchema.validateAt('housingType', { housingType: 'Invalid' })
      ).rejects.toThrow('Invalid housing type');
    });
  });

  describe('Income Validation', () => {
    it('should accept positive income', async () => {
      await expect(
        memberValidationSchema.validateAt('income', { income: 25000 })
      ).resolves.toBe(25000);
    });

    it('should reject negative income', async () => {
      await expect(
        memberValidationSchema.validateAt('income', { income: -1000 })
      ).rejects.toThrow('Income must be a positive number');
    });

    it('should reject zero income', async () => {
      await expect(
        memberValidationSchema.validateAt('income', { income: 0 })
      ).rejects.toThrow('Income must be a positive number');
    });

    it('should reject non-numeric income', async () => {
      await expect(
        memberValidationSchema.validateAt('income', { income: 'abc' })
      ).rejects.toThrow('Income must be a valid number');
    });
  });

  describe('Required Fields Validation', () => {
    it('should reject missing full name', async () => {
      await expect(
        memberValidationSchema.validateAt('fullName', { fullName: '' })
      ).rejects.toThrow('Full name is required');
    });

    it('should reject missing community', async () => {
      await expect(
        memberValidationSchema.validateAt('community', { community: '' })
      ).rejects.toThrow('Community is required');
    });

    it('should reject missing address', async () => {
      await expect(
        memberValidationSchema.validateAt('address', { address: '' })
      ).rejects.toThrow('Address is required');
    });

    it('should reject missing occupation', async () => {
      await expect(
        memberValidationSchema.validateAt('occupation', { occupation: '' })
      ).rejects.toThrow('Occupation is required');
    });

    it('should reject missing education qualification', async () => {
      await expect(
        memberValidationSchema.validateAt('educationQualification', { educationQualification: '' })
      ).rejects.toThrow('Education qualification is required');
    });

    it('should reject missing ration card number', async () => {
      await expect(
        memberValidationSchema.validateAt('rationCardNumber', { rationCardNumber: '' })
      ).rejects.toThrow('Ration card number is required');
    });
  });

  describe('Complete Form Validation', () => {
    it('should validate complete valid member data', async () => {
      await expect(
        memberValidationSchema.validate(validMemberData)
      ).resolves.toEqual(validMemberData);
    });

    it('should allow hasPatta to be false', async () => {
      const data = { ...validMemberData, hasPatta: false };
      await expect(
        memberValidationSchema.validate(data)
      ).resolves.toEqual(data);
    });
  });
});
