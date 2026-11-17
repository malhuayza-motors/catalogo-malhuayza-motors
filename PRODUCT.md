# Product

Catálogo web de **Malhuayza Motors** (Inversiones Malhuayza E.I.R.L.), tienda familiar de motos, scooters, trimotos, cuatrimotos, repuestos y accesorios en Huamanga, Ayacucho (Perú).

## Platform

web (celular primero; la mayoría de visitas llega desde un enlace de WhatsApp).

## Stack

Un solo `index.html` estático (HTML, CSS y JS sin framework) en GitHub Pages. Datos en vivo desde la pestaña "Web" del Google Sheet "Catálogo Vendedores - Malhuayza Motors" (CSV publicado). Fotos, logos y fachadas desde Google Drive (carpetas FOTOS WEB, LOGOS y FACHADA), sincronizadas por un Apps Script cada hora.

## Users

- **Jóvenes** que buscan su primera moto o scooter.
- **Agricultores** que necesitan un vehículo de trabajo (trimotos de carga, todoterreno, utilitarias).
- **Gente de provincias** de Ayacucho que no puede ir a la tienda a cada rato y decide desde el celular.

Lo que más preguntan antes de comprar: **precio, colores, un modelo específico y cuotas**.

## Product Purpose

Que el cliente vea el precio, los colores, la disponibilidad y la cuota aproximada de cada vehículo, y escriba por WhatsApp con el modelo ya elegido.

## Positioning

- **Transparencia:** no se exagera la calidad de las motos ni se promete lo que no hay.
- **Marcas con repuestos:** se trabajan marcas con repuestos originales disponibles en la tienda (garantía de encontrar repuestos). La competencia cambia de marca a cada rato y deja a sus clientes sin repuestos.
- **Todo incluido en la compra:** trámite de tarjeta de propiedad virtual (TIVE) y placa, 1 casco básico (según modelo) y 1 año de garantía.

## Operating Context

- 3 sedes (5 locales) en Huamanga: Jr. Américo Oré 155 (principal, repuestos; taller en el 145), Av. La Victoria 268 (mayor exhibición) y Av. Mariscal Cáceres 509. Lunes a sábado, de 8 a. m. a 7 p. m.
- Financiamiento con Global Go: cuota inicial desde el 20 % y pagos semanales a 12, 18 o 24 meses.
- La columna "Nota" del Sheet se publica: "hasta S/…" es el precio especial de unidades de años anteriores, y "Año 2023/24" es el año de fabricación de unidades a pedido.

## Capabilities and Constraints

- La página no tiene servidor: todo dato nuevo entra por el Sheet o por Drive.
- Solo se pueden subir archivos de texto al repositorio desde las herramientas actuales; las imágenes viven en Drive.
- Las cuotas son una aproximación de simulaciones reales de Global Go; la cuota final la define la evaluación crediticia.

## Brand Commitments

- Rojo de marca, bandera a cuadros, Barlow Condensed en títulos y fuente del sistema en el texto.
- Tono **cercano, honesto y claro**, en español de Perú (propuesto a partir del valor de transparencia; pendiente de confirmar por el dueño).
- Nunca afirmar algo que no se pueda cumplir.

## Evidence on Hand

- Fotos propias de modelos en Drive (en proceso de subida), logos de 7 marcas y fotos de 2 de las 3 sedes.
- Datos de stock, precios y sedes actualizados desde el Sheet.

## Product Principles

1. Las motos primero: el cliente debe ver vehículos en la primera pantalla.
2. Precio y disponibilidad siempre visibles; nada escondido.
3. Cada camino termina en WhatsApp con el modelo ya escrito en el mensaje.
4. Mostrar lo que diferencia a la tienda: repuestos originales y lo incluido en la compra.

## Accessibility & Inclusion

- Contraste WCAG AA, botones de al menos 44 px para el pulgar, lenguaje simple.
- Pensado para celulares de gama media y conexiones lentas de provincia (fotos en miniatura y carga diferida).
