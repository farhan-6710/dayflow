import 'dart:math' as math;

import 'package:flutter/material.dart';

/// Google's four-colour G. These brand colours are fixed, so they aren't theme tokens.
class GoogleMark extends StatelessWidget {
  const GoogleMark({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox.square(
      dimension: 20,
      child: CustomPaint(painter: _GooglePainter()),
    );
  }
}

class _GooglePainter extends CustomPainter {
  const _GooglePainter();

  @override
  void paint(Canvas canvas, Size size) {
    final stroke = size.width * 0.2;
    final rect = Rect.fromCircle(
      center: size.center(Offset.zero),
      radius: (size.width - stroke) / 2,
    );
    Paint paintFor(int color) => Paint()
      ..color = Color(color)
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke;
    const degree = math.pi / 180;
    canvas.drawArc(
      rect,
      -45 * degree,
      -95 * degree,
      false,
      paintFor(0xFFEA4335),
    );
    canvas.drawArc(
      rect,
      -140 * degree,
      -80 * degree,
      false,
      paintFor(0xFFFBBC05),
    );
    canvas.drawArc(
      rect,
      140 * degree,
      -95 * degree,
      false,
      paintFor(0xFF34A853),
    );
    canvas.drawArc(
      rect,
      45 * degree,
      -45 * degree,
      false,
      paintFor(0xFF4285F4),
    );
    canvas.drawRect(
      Rect.fromLTWH(
        size.width / 2,
        size.height / 2 - stroke / 2,
        size.width / 2,
        stroke,
      ),
      Paint()..color = const Color(0xFF4285F4),
    );
  }

  @override
  bool shouldRepaint(_GooglePainter oldDelegate) => false;
}
