import 'package:flutter/material.dart';

import '../../../shared/models/client_item.dart';
import '../../../shared/models/metric_item.dart';

abstract final class ClientsData {
  static const formFields = ['Company', 'Contact', 'Email'];
  static const totalCount = 11;
  static const activeCount = 11;

  static const metrics = [
    MetricItem(label: 'Total', value: '11', icon: Icons.person_outline_rounded),
    MetricItem(
      label: 'Active',
      value: '11',
      icon: Icons.check_circle_outline_rounded,
    ),
  ];

  static const clients = [
    ClientItem(
      company: 'Almo Laminates',
      contact: 'Customer Care',
      email: 'info@almolaminates.com',
    ),
    ClientItem(
      company: 'Eat Rite',
      contact: 'Mukta',
      email: 'info@eatrite.com',
    ),
    ClientItem(
      company: 'Hotel Saptagiri',
      contact: 'Reservations Desk',
      email: 'info@hotelsaptagiri.in',
    ),
    ClientItem(
      company: 'Infinity Construction NYC',
      contact: 'Brooklyn Office',
      email: 'info@infinitynyc.com',
    ),
    ClientItem(
      company: 'Mantoor Group',
      contact: 'Sales Team',
      email: 'info@mantoorgroup.com',
    ),
  ];
}
