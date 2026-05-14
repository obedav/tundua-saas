export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}
