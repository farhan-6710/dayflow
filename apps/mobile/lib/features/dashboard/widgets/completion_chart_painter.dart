import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../../core/constants/sample_data/dashboard_data.dart';

/// Draws the grid, the filled completed line and the dashed previous line.
class CompletionChartPainter extends CustomPainter {
  CompletionChartPainter({
    required this.progress,
    required this.accent,
    required this.previous,
    required this.grid,
    required this.labelStyle,
  });

  final double progress;
  final Color accent;
  final Color previous;
  final Color grid;
  final TextStyle labelStyle;

  static const _left = 16.0;

  Offset _point(List<double> series, int index, Size size) {
    final x = _left + (size.width - _left) * index / (series.length - 1);
    return Offset(
      x,
      size.height * (1 - series[index] / DashboardData.chartMax),
    );
  }

  Path _smooth(List<double> series, Size size) {
    final path = Path()
      ..moveTo(_point(series, 0, size).dx, _point(series, 0, size).dy);
    for (var i = 0; i < series.length - 1; i++) {
      final a = _point(series, i, size);
      final b = _point(series, i + 1, size);
      final midX = (a.dx + b.dx) / 2;
      path.cubicTo(midX, a.dy, midX, b.dy, b.dx, b.dy);
    }
    return path;
  }

  void _dashed(Canvas canvas, Path path, Paint paint) {
    for (final metric in path.computeMetrics()) {
      for (var d = 0.0; d < metric.length; d += 6) {
        canvas.drawPath(metric.extractPath(d, d + 3), paint);
      }
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = grid
      ..strokeWidth = 1;
    for (final tick in DashboardData.chartTicks) {
      final y = size.height * (1 - tick / DashboardData.chartMax);
      canvas.drawLine(Offset(_left, y), Offset(size.width, y), gridPaint);
      final text = TextPainter(
        text: TextSpan(text: '$tick', style: labelStyle),
        textDirection: TextDirection.ltr,
      )..layout();
      text.paint(canvas, Offset(0, y - text.height / 2));
    }

    canvas.clipRect(Rect.fromLTWH(0, 0, size.width * progress, size.height));
    final line = _smooth(DashboardData.completedSeries, size);
    final fill = Path.from(line)
      ..lineTo(size.width, size.height)
      ..lineTo(_left, size.height)
      ..close();
    canvas.drawPath(
      fill,
      Paint()
        ..shader = ui.Gradient.linear(Offset.zero, Offset(0, size.height), [
          accent.withValues(alpha: 0.22),
          accent.withValues(alpha: 0.26),
        ]),
    );

    final stroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    _dashed(
      canvas,
      _smooth(DashboardData.previousSeries, size),
      stroke
        ..color = previous
        ..strokeWidth = 1.2,
    );
    canvas.drawPath(
      line,
      stroke
        ..color = accent
        ..strokeWidth = 1.8,
    );
  }

  @override
  bool shouldRepaint(CompletionChartPainter old) =>
      old.progress != progress ||
      old.accent != accent ||
      old.previous != previous ||
      old.grid != grid;
}
