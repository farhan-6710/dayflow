import 'package:flutter/material.dart';

class ProjectItem {
  const ProjectItem({
    required this.name,
    required this.client,
    required this.color,
    this.isActive = true,
  });

  final String name;
  final String client;

  /// A project's own colour, like `color_hex` in the database.
  final Color color;
  final bool isActive;
}
