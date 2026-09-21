-- Church Census System Database Schema
-- This file is for reference only. Tables are created automatically by Sequelize.

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  aadhar_number CHAR(12) NOT NULL UNIQUE,
  phone_number VARCHAR(10) NOT NULL,
  community VARCHAR(50) NOT NULL,
  sub_caste VARCHAR(50) NOT NULL,
  housing_type VARCHAR(30) NOT NULL CHECK(housing_type IN ('Rent', 'Owned', 'Government Provided')),
  address TEXT NOT NULL,
  has_patta BOOLEAN,
  occupation VARCHAR(100) NOT NULL,
  income DECIMAL(10,2) NOT NULL CHECK(income >= 0),
  education_qualification VARCHAR(100) NOT NULL,
  ration_card_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_members_name ON members(full_name);
CREATE INDEX IF NOT EXISTS idx_members_community ON members(community);
CREATE INDEX IF NOT EXISTS idx_members_aadhar ON members(aadhar_number);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at 
BEFORE UPDATE ON members
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
