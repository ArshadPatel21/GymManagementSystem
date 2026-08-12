
CREATE DATABASE IF NOT EXISTS gym_management_system;
USE gym_management_system;

CREATE TABLE IF NOT EXISTS memberships (
    membership_id   INT AUTO_INCREMENT PRIMARY KEY,
    plan_name       VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    description     VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trainers (
    trainer_id      INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    phone           VARCHAR(20),
    specialization  VARCHAR(100),
    salary          DECIMAL(10,2),
    joining_date    DATE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    member_id       INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    phone           VARCHAR(20),
    address         VARCHAR(255),
    gender          ENUM('Male', 'Female', 'Other'),
    dob             DATE,
    join_date       DATE DEFAULT (CURRENT_DATE),
    membership_id   INT,
    trainer_id      INT,
    status          ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES memberships(membership_id) ON DELETE SET NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id   INT AUTO_INCREMENT PRIMARY KEY,
    member_id       INT NOT NULL,
    date            DATE NOT NULL,
    check_in_time   TIME,
    status          ENUM('Present', 'Absent') DEFAULT 'Present',
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id      INT AUTO_INCREMENT PRIMARY KEY,
    member_id       INT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    payment_date    DATE DEFAULT (CURRENT_DATE),
    payment_method  ENUM('Cash', 'Card', 'UPI', 'Bank Transfer') DEFAULT 'Cash',
    status          ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Paid',
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

INSERT INTO memberships (plan_name, duration_months, price, description) VALUES
('Monthly Basic', 1, 1000.00, 'Access to gym equipment only'),
('Quarterly Standard', 3, 2700.00, 'Gym access + group classes'),
('Annual Premium', 12, 9600.00, 'Full access including personal training sessions');

INSERT INTO trainers (name, email, phone, specialization, salary, joining_date) VALUES
('Rahul Sharma', 'rahul.trainer@gym.com', '9876543210', 'Strength Training', 25000.00, '2025-01-15'),
('Priya Vastav', 'priya.trainer@gym.com', '9876543211', 'Yoga & Flexibility', 22000.00, '2025-02-01');
