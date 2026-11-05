import 'package:flutter/material.dart';

import '../../../shared/models/metric_item.dart';
import '../../../shared/models/project_item.dart';

abstract final class ProjectsData {
  static const formFields = ['Project name', 'Client or organization'];
  static const totalCount = 15;
  static const activeCount = 15;

  static const metrics = [
    MetricItem(label: 'Total', value: '15', icon: Icons.folder_outlined),
    MetricItem(
      label: 'Active',
      value: '15',
      icon: Icons.check_circle_outline_rounded,
    ),
  ];

  static const projects = [
    ProjectItem(
      name: 'Testing site',
      client: 'Testing Company',
      color: Color(0xFFB57EE5),
    ),
    ProjectItem(
      name: 'Eat Rite site upkeep',
      client: 'Eat Rite',
      color: Color(0xFF16A34A),
    ),
    ProjectItem(
      name: 'Saptagiri hotel site',
      client: 'Hotel Saptagiri',
      color: Color(0xFFC2263C),
    ),
    ProjectItem(
      name: 'Mantoor site upkeep',
      client: 'Mantoor Group',
      color: Color(0xFFD99A0B),
    ),
    ProjectItem(
      name: 'Infinity NYC site',
      client: 'Infinity Construction NYC',
      color: Color(0xFF7D7468),
    ),
    ProjectItem(
      name: 'Nick Roofing site',
      client: 'Nick Roofing',
      color: Color(0xFF2F4A73),
    ),
    ProjectItem(
      name: 'Yash Computers site',
      client: 'Yash Computers',
      color: Color(0xFF2F6FE0),
    ),
  ];
}
