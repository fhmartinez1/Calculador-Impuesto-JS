//Declaro variables
const suma = (a, b) => a + b;
const aplicarImpuesto = (a, b) => (b.reduce((acumulador, item) => acumulador + item.valor, 0)) * a;

//Traigo botones del dom y les agrego un listener
let submit_precio = document.getElementById("submitPrecio");
let submit_historial = document.getElementById("submitHistorial");
submit_precio.addEventListener('click', calcularImpuesto);
submit_historial.addEventListener('click', getHistorial);

async function calcularImpuesto() {

    //Traigo la lista de impuestos
    const respuesta = await fetch("./json/impuestos.json");
    const lista_impuestos = await respuesta.json();

    //Guardo el precio escrito en la pagina
    let precio = parseFloat(document.getElementById("inputPrecio").value);

    //Guardo el tipo de producto del checkbox
    let tipo_producto;
    let radio_producto = document.getElementsByName("radioProducto");
    for (let i = 0; i < radio_producto.length; i++) {
        radio_producto[i].checked && (tipo_producto = radio_producto[i].value);
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
    h1_precioFinal.innerHTML = "$ " + precio_total; //Deberia convertir la variable a string?

    //Muestro el titulo de impuestos aplicados
    let titulo_impuestos = document.getElementById("tituloImpuestos");
    titulo_impuestos.style.visibility = "visible";

    //Navego el array para nombrar los impuestos aplicados y creo un li para cada uno
    let ul_impuestos = document.getElementById("listaImpuestos");
    ul_impuestos.innerHTML = "";
    for (let i = 0; i < lista_filtrada.length; i++) {
        let li_nuevo = document.createElement("li");
        li_nuevo.innerHTML = `${lista_filtrada[i].nombre}`;
        li_nuevo.classList.add('list-group-item');
        li_nuevo.classList.add('lista-impuestos');
        ul_impuestos.append(li_nuevo);
    }

    //Guardo la informacion para usar como historial
    let historial = [];
    let historial_storage = localStorage.getItem("historial");
    let append_historial = { precio: precio, tipo: tipo_producto, precio_final: precio_total };

    historial_storage && (historial = JSON.parse(historial_storage));

    historial.push(append_historial);
    localStorage.setItem("historial", JSON.stringify(historial));
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
            li_nuevo.classList.add("list-group-item");
            ul_historial.append(li_nuevo);
        }
    } else {
        Toastify({
            text: "No hay historial disponible.",
            duration: 3000,
            position: "right",
            style: {
                background: "#F2D388",
                color: "#874C62",
                fontWeight: "bold"
            },
        }).showToast();
    }
}

let btn_delete = document.getElementById("deleteHistorial");
btn_delete.addEventListener('click', () => {
    localStorage.clear();
    document.getElementById("historialPrecios").innerHTML = "";
    Toastify({
        text: "Historial borrado!",
        duration: 4000,
        position: "right",
        style: {
            background: "#F2D388",
            color: "#874C62",
            fontWeight: "bold"
          },
    }).showToast();
});