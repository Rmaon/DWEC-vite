class Producto {
  constructor(nombre, precio, cantidad) {
    this.id = Producto.incrementarId();
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }
    static incrementarId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
}

