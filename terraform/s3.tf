
# S3 Bucket
resource "aws_s3_bucket" "main" {
  bucket        = "cyclecare-dev-app-assets-0q2dox54"
  force_destroy = false

  tags = {
    Name                   = "${var.project_name}-bucket"
    Project                = var.project_name
    TerraPilotProject      = var.project_name
    TerraPilotResourceType = "s3-bucket"
    Environment            = var.environment
    ManagedBy              = "TerraPilot"
    CostSensitive          = "true"
  }
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


resource "aws_s3_bucket_ownership_controls" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# PostgreSQL backup bucket
resource "aws_s3_bucket" "postgres_backups" {
  bucket        = var.postgres_backup_bucket_name != "" ? var.postgres_backup_bucket_name : "${local.resource_prefix}-postgres-backups-${random_id.suffix.hex}"
  force_destroy = false

  tags = {
    Name                   = "${var.project_name}-postgres-backups"
    Project                = var.project_name
    TerraPilotProject      = var.project_name
    TerraPilotResourceType = "s3-bucket"
    Environment            = var.environment
    ManagedBy              = "TerraPilot"
    Purpose                = "PostgreSQL database backups"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "postgres_backups" {
  bucket = aws_s3_bucket.postgres_backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "postgres_backups" {
  bucket = aws_s3_bucket.postgres_backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
