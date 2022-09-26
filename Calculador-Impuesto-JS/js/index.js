//Declaro variables
const suma = (a, b) => a + b;
const aplicarImpuesto = (a, b) => (b.reduce((acumulador, item) => acumulador + item.valor, 0)) * a;

//La idea de este array es poder modificar los impuestos a nombrar en caso de haber un cambio en las leyes de importacion
let lista_impuestos = [
    { id: 1, nombre: "IVA bienes de capital o informática: 21%", valor: 0.21, aplica: ["bien-capital", "informatica"] },
    { id: 2, nombre: "IVA adicional: 20%", valor: 0.2, aplica: ["todos"] },
    { id: 3, nombre: "Derechos de importación Ad valorem: 35%", valor: 0.35, aplica: ["todos"] }
];

let submit_precio = document.getElementById("submitPrecio");
let submit_historial = document.getElementById("submitHistorial");
submit_precio.addEventListener('click', calcularImpuesto);
submit_historial.addEventListener('click', getHistorial);

function calcularImpuesto() {
    //Guardo el precio escrito en la pagina
    let precio = parseFloat(document.getElementById("inputPrecio").value);

    //Guardo el tipo de producto del checkbox
    let tipo_producto;
    let radio_producto = document.getElementsByName("radioProducto");
    for (let i = 0; i < radio_producto.length; i++) {
        if (radio_producto[i].checked) {
            tipo_producto = radio_producto[i].value;
        }
    }




    //Creo una lista que va a tener los elementos filtrados para el tipo de producto correspondiente
    const lista_filtrada = lista_impuestos.filter(checkAplica);

    function checkAplica(lista) {
        return lista.aplica.includes(tipo_producto) || lista.aplica.includes("todos");
    }

    //Funcion para calcular impuesto
    let precio_total = suma(precio, aplicarImpuesto(precio, lista_filtrada));

    //Muestro el resultado
    let h1_precioFinal = document.getElementById("precioFinal")
    h1_precioFinal.innerHTML = precio_total; //Deberia convertir la variable a string?

    //Navego el array para nombrar los impuestos aplicados y creo un li para cada uno
    let ul_impuestos = document.getElementById("listaImpuestos");
    ul_impuestos.innerHTML = "";
    for (let i = 0; i < lista_filtrada.length; i++) {
        let li_nuevo = document.createElement("li");
        li_nuevo.innerHTML = `${lista_filtrada[i].nombre}`;
        // li_nuevo.classList.add('list-group-item');
        ul_impuestos.append(li_nuevo);
    }

    //Guardo la informacion para usar como historial
    let historial = [];
    let historial_storage = localStorage.getItem("historial");
    let append_historial = { precio: precio, tipo: tipo_producto, precio_final: precio_total };

    if (historial_storage) {
        historial = JSON.parse(historial_storage);
    }

    historial.push(append_historial);
    localStorage.setItem("historial", JSON.stringify(historial))
}

function getHistorial() {
    let historial_string = localStorage.getItem("historial");
    let historial = JSON.parse(historial_string);
    let ul_historial = document.getElementById("historialPrecios");

    ul_historial.innerHTML = "";

    if (historial_string) {
        for (let i = 0; i < historial.length; i++) {
            let li_nuevo = document.createElement("li");
            li_nuevo.innerHTML = `Precio Inicial: ${historial[i].precio} - Tipo de producto: ${historial[i].tipo} - Precio Final: ${historial[i].precio_final}`;
            // li_nuevo.classList.add('list-group-item');
            ul_historial.append(li_nuevo);
        }
    } else {
        ul_historial.innerHTML = "No hay historial disponible.";
    }
}
