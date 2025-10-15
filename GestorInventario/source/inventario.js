
export class Producto {
  constructor(nombre, precio, cantidad = 1) {
    if (typeof nombre !== "string" || !nombre.trim()) {
      throw new Error("El nombre del producto debe ser un string no vacío.");
    }
    if (!Number.isFinite(precio) || precio < 0) {
      throw new Error("El precio debe ser un número >= 0.");
    }
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      throw new Error("La cantidad debe ser un entero >= 0.");
    }
    this.nombre = nombre.trim();
    this.precio = Number(precio);
    this.cantidad = cantidad;
  }

  get subtotal() {
    return this.precio * this.cantidad;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      precio: this.precio,
      cantidad: this.cantidad,
      subtotal: this.subtotal,
    };
  }

  toString() {
    return `${this.nombre} | $${this.precio.toFixed(2)} x ${this.cantidad} = $${this.subtotal.toFixed(2)}`;
  }

  static desde(obj) {
    return new Producto(obj.nombre, obj.precio, obj.cantidad ?? 1);
  }
}

export class Inventario {
  constructor(productosIniciales = []) {
    this.productos = [];
    for (const p of productosIniciales) this.agregarProducto(p);
  }

  #indexPorNombre(nombre) {
    return this.productos.findIndex(p => p.nombre.toLowerCase() === String(nombre).toLowerCase());
  }

  agregarProducto(producto) {
    const p = producto instanceof Producto ? producto : Producto.desde(producto);
    const idx = this.#indexPorNombre(p.nombre);

    if (idx >= 0) {
      this.productos[idx].cantidad += p.cantidad;
      this.productos[idx].precio = p.precio;
    } else {
      this.productos.push(p);
    }
    return this;
  }

  eliminarProducto(nombre, cantidad = null) {
    const idx = this.#indexPorNombre(nombre);
    if (idx < 0) return false;

    if (cantidad == null) {
      this.productos.splice(idx, 1);
      return true;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error("La cantidad a eliminar debe ser un entero > 0 o null para eliminar todo.");
    }

    const p = this.productos[idx];
    if (cantidad >= p.cantidad) {
      this.productos.splice(idx, 1);
    } else {
      p.cantidad -= cantidad;
    }
    return true;
  }

  calcularValorTotal() {
    return this.productos.reduce((acc, p) => acc + p.subtotal, 0);
  }

  aplicarDescuento(descuento) {
    const total = this.calcularValorTotal();

    if (!descuento || !["porcentaje", "fijo"].includes(descuento.tipo)) {
      throw new Error("Descuento inválido. Usa { tipo: 'porcentaje'|'fijo', valor: number }");
    }
    if (!Number.isFinite(descuento.valor) || descuento.valor < 0) {
      throw new Error("El valor del descuento debe ser un número >= 0.");
    }

    let totalConDescuento = total;
    if (descuento.tipo === "porcentaje") {
      totalConDescuento = total * (1 - descuento.valor / 100);
    } else if (descuento.tipo === "fijo") {
      totalConDescuento = total - descuento.valor;
    }
    return Math.max(0, Number(totalConDescuento));
  }

  mostrarProductos() {
    if (this.productos.length === 0) {
      console.log("No hay productos en el inventario.");
      return;
    }
    console.log("📦 Inventario actual:");
    console.table(this.productos.map(p => p.toJSON()));
  }
}
