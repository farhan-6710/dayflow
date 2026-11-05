class ClientItem {
  const ClientItem({
    required this.company,
    required this.contact,
    required this.email,
    this.isActive = true,
  });

  final String company;
  final String contact;
  final String email;
  final bool isActive;
}
