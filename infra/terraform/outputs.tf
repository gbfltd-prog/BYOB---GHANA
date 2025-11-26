output "cluster_name" {
  value = module.eks.cluster_name
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}
