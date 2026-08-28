document.querySelector('.legal-skip')?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector('main');
  main?.focus();
  main?.scrollIntoView();
});
