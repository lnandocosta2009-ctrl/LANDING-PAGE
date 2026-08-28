// ==================================================================
// BOTÃO "VOLTAR AO TOPO"
// A ideia: o botão fica escondido no início da página. Depois que a
// pessoa rola pra baixo (mais de 400px), ele aparece no canto da tela.
// Clicando nele, a página rola suavemente de volta pro topo.
// ==================================================================

const btnTopo = document.getElementById('btnTopo');

// Mostra ou esconde o botão de acordo com o quanto a página foi rolada
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    btnTopo.classList.add('is-visible');
  } else {
    btnTopo.classList.remove('is-visible');
  }
});

// Ao clicar, rola a página de volta pro topo com animação suave
btnTopo.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==================================================================
// Quer adicionar mais interações depois (ex: menu, formulário de
// contato, modo claro/escuro)? Pode escrever o código aqui embaixo.
// ==================================================================
