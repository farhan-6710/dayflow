import 'package:flutter/material.dart';

/// One row on the More screen.
class MenuItem {
  const MenuItem({required this.icon, required this.title, this.subtitle});

  final IconData icon;
  final String title;
  final String? subtitle;
}
