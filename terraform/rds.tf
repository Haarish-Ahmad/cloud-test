# 1. Place the database inside your VPC Subnets
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "ecommerce-rds-subnet-group"
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id] 
}

# 2. Create a Firewall (Security Group) for the database
resource "aws_security_group" "rds_sg" {
  name        = "ecommerce-rds-sg"
  vpc_id      = aws_vpc.main.id

  # Allow MySQL traffic (Port 3306)
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Build the MySQL Database
resource "aws_db_instance" "mysql" {
  identifier           = "ecommerce-rds-db"
  allocated_storage    = 20 
  engine               = "mysql"
  engine_version       = "8.0" 
  instance_class       = "db.t4g.micro" 
  
  # Your Database Credentials (will be empty on creation)
  db_name              = "ecommerce"
  username             = "ecommerce_user"
  password             = "password123" 
  
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  
  publicly_accessible = true 
  skip_final_snapshot = true
}

