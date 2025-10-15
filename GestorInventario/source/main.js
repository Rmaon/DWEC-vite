
import { Inventario, Producto } from "./inventario.js";

const inventario = new Inventario([
  new Producto("Manzana", 0.5, 10),
  new Producto("Leche", 1.2, 4),
  { nombre: "Arroz", precio: 0.9, cantidad: 3 },
]);

function pedirTexto(msg) {
  let v = prompt(msg);
  if (v === null) return null;
  v = v.trim();
  if (!v) {
    alert("Debe ingresar texto.");
    return pedirTexto(msg);
  }
  return v;
}

function pedirNumero(msg, { min = -Infinity, max = Infinity } = {}) {
  let v = prompt(msg);
  if (v === null) return null;
  v = v.trim().replace(",", ".");
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) {
    alert(`Ingrese un número válido entre ${min} y ${max}.`);
    return pedirNumero(msg, { min, max });
  }
  return n;
}

function pedirEntero(msg, { min = -Infinity, max = Infinity } = {}) {
  let v = prompt(msg);
  if (v === null) return null;
  v = v.trim();
  if (!/^-?\d+$/.test(v)) {
    alert("Ingrese un número entero.");
    return pedirEntero(msg, { min, max });
  }
  const n = Number(v);
  if (n < min || n > max) {
    alert(`Ingrese un entero entre ${min} y ${max}.`);
    return pedirEntero(msg, { min, max });
  }
  return n;
}

function accionListar() {
  console.clear();
  console.log("📦 Inventario actual:");
  inventario.mostrarProductos();
  console.log("Valor total:", `$${inventario.calcularValorTotal().toFixed(2)}`);
}

function accionAgregar() {
  const nombre = pedirTexto("Nombre del producto:");
  if (nombre === null) return;
  const precio = pedirNumero(`Precio de "${nombre}":`, { min: 0 });
  if (precio === null) return;
  const cantidad = pedirEntero(`Cantidad de "${nombre}":`, { min: 0 });
  if (cantidad === null) return;

  inventario.agregarProducto(new Producto(nombre, precio, cantidad));
  console.log(`✅ Agregado: ${nombre} x${cantidad} @ $${precio}`);
  inventario.mostrarProductos();
}

function accionEliminar() {
  const nombre = pedirTexto("Nombre del producto a eliminar:");
  if (nombre === null) return;

  const modo = prompt(
    `Eliminar cantidad específica o todo el producto "${nombre}"?\n` +
    `- Deja vacío para eliminar TODO\n` +
    `- O escribe la cantidad a eliminar`
  );
  if (modo === null) return;

  if (modo.trim() === "") {
    const ok = inventario.eliminarProducto(nombre, null);
    console.log(ok ? `🗑️ Eliminado por completo: ${nombre}` : `⚠️ No se encontró: ${nombre}`);
  } else {
    const cant = Number(modo);
    if (!Number.isInteger(cant) || cant <= 0) {
      alert("Cantidad inválida. Debe ser un entero > 0.");
      return;
    }
    const ok = inventario.eliminarProducto(nombre, cant);
    console.log(ok ? `➖ Eliminadas ${cant} unidades de ${nombre}` : `⚠️ No se encontró: ${nombre}`);
  }
  inventario.mostrarProductos();
}

function accionTotal() {
  const total = inventario.calcularValorTotal();
  console.log(`🧮 Valor total del inventario: $${total.toFixed(2)}`);
}

function accionDescuento() {
  const tipoRaw = prompt(
    "Tipo de descuento:\n" +
    "1) Porcentaje (ej. 10 = 10%)\n" +
    "2) Fijo (resta una cantidad)\n" +
    "Elige 1 o 2:"
  );
  if (tipoRaw === null) return;

  const tipo = tipoRaw.trim() === "1" ? "porcentaje" :
               tipoRaw.trim() === "2" ? "fijo" : null;
  if (!tipo) {
    alert("Opción inválida.");
    return;
  }

  const valor = pedirNumero(`Valor del descuento (${tipo === "porcentaje" ? "%" : "monto"}):`, { min: 0 });
  if (valor === null) return;

  const result = inventario.aplicarDescuento({ tipo, valor });
  console.log(
    `🏷️ Descuento aplicado (${tipo}=${valor}). Total con descuento: $${result.toFixed(2)}`
  );
}

function menu() {
  console.clear();
  console.log("=== Inventario (POO + consola) ===");
  inventario.mostrarProductos();

  let salir = false;
  while (!salir) {
    const opcion = prompt(
      "MENÚ\n" +
      "1) Listar productos\n" +
      "2) Agregar producto\n" +
      "3) Eliminar producto\n" +
      "4) Calcular valor total\n" +
      "5) Aplicar descuento\n" +
      "6) Salir\n" +
      "Elige una opción (1-6):"
    );
    if (opcion === null) {
      if (confirm("¿Deseas salir del programa?")) break;
      else continue;
    }

    switch (opcion.trim()) {
      case "1": accionListar(); break;
      case "2": accionAgregar(); break;
      case "3": accionEliminar(); break;
      case "4": accionTotal(); break;
      case "5": accionDescuento(); break;
      case "6": salir = true; break;
      default:
        alert("Opción inválida. Elige del 1 al 6.");
    }
  }

  console.log("👋 Programa finalizado.");
}

window.addEventListener("load", () => {
  alert("Se abrirá un menú por prompts.\nMira la pestaña Console (F12) para ver la salida.");
  menu();
});
