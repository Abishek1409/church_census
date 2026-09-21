# Church Census Backend API

RESTful API for the Church Census System built with Node.js, Express, and PostgreSQL.

## Features

- PostgreSQL database with Sequelize ORM
- Member management (CRUD operations)
- Data validation and constraints
- Free hosting on Render.com
- Automatic database sync

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Hosting**: Render.com (Free tier)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
```

### 3. Test Database Connection
```bash
npm run test:db
```

### 4. Start Server
```bash
npm start          # Production
npm run dev        # Development (with nodemon)
```

## Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions on:
- Setting up Render.com PostgreSQL (free)
- Local PostgreSQL setup
- Schema details
- Troubleshooting

## API Endpoints

### Health & Info
- `GET /api/health` - Health check (for monitoring)
- `GET /` - API info

### Member Management
- `POST /api/members` - Create member
- `GET /api/members` - Get all members (with pagination)
- `GET /api/members/:id` - Get single member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Search & Filter
- `GET /api/members/search?query=name` - Search by name
- `GET /api/members/filter?community=X&housingType=Y` - Filter members

### Statistics
- `GET /api/stats` - Get member statistics

## Project Structure

```
backend/
├── config/
│   ├── database.js       # Sequelize configuration
│   └── schema.sql        # SQL schema reference
├── models/
│   ├── index.js          # Models export
│   └── Member.js         # Member model with validations
├── controllers/          # Route controllers (Task 3)
├── routes/               # API routes (Task 3)
├── server.js             # Express app entry point
├── test-connection.js    # Database test script
└── .env                  # Environment variables (not in git)
```

## Member Model

Fields:
- Personal: fullName, aadharNumber, phoneNumber, community, subCaste
- Housing: housingType, address, hasPatta
- Occupation: occupation, income
- Education: educationQualification
- Documentation: rationCardNumber

Validations:
- Aadhar: 12 digits, unique
- Phone: 10 digits
- Income: Positive decimal
- All fields required (except hasPatta)

## Development

### Available Scripts

- `npm start` - Start server
- `npm run dev` - Start with nodemon
- `npm run test:db` - Test database connection

### Environment Variables

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Deployment

### Render.com Deployment (Free)

This backend is designed to be deployed on Render.com's free tier.

**Quick Deploy**:
1. Push code to GitHub
2. Create PostgreSQL database on Render.com
3. Create Web Service and connect GitHub repo
4. Set environment variables
5. Deploy automatically

**Detailed Guide**: See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

**Deployment Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**Key Files**:
- `render.yaml` - Render blueprint for one-click deploy
- `.env.example` - Template for environment variables
- `.gitignore` - Excludes secrets from Git

**Cost**: ₹0/month (100% free with Render.com free tier)

### Keep-Alive (Important for Free Tier)

Free tier services sleep after 15 minutes of inactivity. Set up a cron job:
- Use cron-job.org or UptimeRobot (both free)
- Ping `/api/health` every 14 minutes
- Keeps service awake 24/7

See deployment guide for detailed setup instructions.

## License

ISC
