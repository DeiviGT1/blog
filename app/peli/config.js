// Todo lo que cambia está aquí. El resto del sitio no se toca.
window.SALIMOS = {
  para: "",                        // su nombre; vacío = no se muestra
  de: "Jose",                      // a quién le "llega" la confirmación (lo que ella ve)

  // La película correcta (la única que se deja escoger)
  pelicula: { titulo: "Rápidos y Furiosos 3", poster: "images/rapidos3.jpg" },
  // Las que huyen cuando intenta escogerlas
  senuelos: [
    { titulo: "Shrek 2",  poster: "images/shrek2.jpg" },
    { titulo: "Titanic",  poster: "images/titanic.png" },
  ],

  // Datos de la cita — MOCKUP, cámbialos
  fecha: "Viernes 2 de octubre",
  hora:  "11:30 pm",
  lugar: "Mi casa",

  // Aviso real para ti. Clave gratis en https://web3forms.com (te la mandan al correo).
  // Vacía = no envía nada, pero ella igual ve el mensaje de confirmación.
  web3forms_key: "",

  // Lo que dice el botón NO cada vez que se escapa
  excusas: ["No", "¿Está segura?", "Piénselo bien", "Dele…", "Última oportunidad", "Ya, diga que sí"],
};
