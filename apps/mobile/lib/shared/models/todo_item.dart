class TodoItem {
  const TodoItem({
    required this.title,
    required this.details,
    this.done = false,
  });

  final String title;
  final String details;
  final bool done;
}
