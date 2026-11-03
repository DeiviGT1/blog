// Todo lo que cambia está aquí. El resto del sitio no se toca.
window.SALIMOS = {
  para: "",                        // su nombre; vacío = no se muestra
  de: "Jose",                      // a quién le "llega" la confirmación (lo que ella ve)

  // Las películas para escoger (todas se dejan escoger)
  peliculas: [
    { titulo: "Rápidos y Furiosos 6", poster: "images/rapidos6.jpg" },
    { titulo: "Cars",                 poster: "images/cars.jpg" },
    { titulo: "El Principito",        poster: "images/principito.jpg" },
    { titulo: "Attack on Titan",      poster: "images/titan.jpg" },
  ],

  // Datos de la cita — MOCKUP, cámbialos
  fecha: "Viernes 2 de octubre",
  hora:  "11:30 pm",
  lugar: "Mi casa",

  // Al confirmar, el servidor (/peli/confirmar) te manda un correo. No hay que configurar nada aquí.

  // Lo que dice el botón NO cada vez que se escapa
  excusas: ["No", "¿Está segura?", "Piénselo bien", "Dele…", "Última oportunidad", "Ya, diga que sí"],
};
