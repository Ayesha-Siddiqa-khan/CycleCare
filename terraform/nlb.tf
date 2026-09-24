# Optional Network Load Balancer for ingress-nginx
resource "aws_lb" "ingress_nginx" {
  count              = var.enable_kubernetes_ingress_nlb ? 1 : 0
  name               = "${local.resource_prefix}-ingress-nlb"
  internal           = false
  load_balancer_type = "network"
  subnets            = local.public_subnet_ids

  enable_cross_zone_load_balancing = true

  tags = {
    Name        = "${local.resource_prefix}-ingress-nlb"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "TerraPilot"
  }
}
