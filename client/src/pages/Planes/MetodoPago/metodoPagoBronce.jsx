import React, { useState } from "react";
import "./metodoPagoStyle.css";

function MetodoPagoBronce() {
  const [form, setForm] = useState({
    email: "",
    cardNumber: "",
    expDate: "",
    cvc: "",
    cardHolder: "",
    country: "Uruguay",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    province: "",
    saveInfo: false,
    company: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Formulario enviado correctamente");
  };

  return (
    <div className="checkout-container">
      <div className="summary-section">
        <h1 className="brand">Team Finder</h1>
        <h2 className="summary-title">Suscribirse al Plan Bronce</h2>

        <div className="price">
          <h3>USD 20 / mes</h3>
          <p>Hasta 50 usuarios, ideal para startups y pequeñas empresas</p>
        </div>

        <div className="summary-box">
          <div className="summary-item">
            <span>Usuarios incluidos</span>
            <span>Hasta 50</span>
          </div>
          <div className="summary-item">
            <span>Funcionalidades</span>
            <span>Chat anónimo, tablero avanzado</span>
          </div>
          <div className="summary-item">
            <span>Estadísticas</span>
            <span>No incluidas</span>
          </div>
          <div className="summary-total">
            <span>Total a pagar</span>
            <span>USD 20 / mes</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit} className="payment-form">
          <h3>Información de contacto</h3>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
          />

          <h3>Método de pago</h3>

          <label>Información de la tarjeta</label>
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="1234 1234 1234 1234"
            required
          />

          <div className="row">
            <input
              type="text"
              name="expDate"
              value={form.expDate}
              onChange={handleChange}
              placeholder="MM / AA"
              required
            />
            <input
              type="text"
              name="cvc"
              value={form.cvc}
              onChange={handleChange}
              placeholder="CVC"
              required
            />
          </div>

          <label>Nombre del titular de la tarjeta</label>
          <input
            type="text"
            name="cardHolder"
            value={form.cardHolder}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />

          <label>Dirección de facturación</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
          >
            <option>Uruguay</option>
            <option>Argentina</option>
            <option>Chile</option>
            <option>Brasil</option>
          </select>

          <input
            type="text"
            name="address1"
            value={form.address1}
            onChange={handleChange}
            placeholder="Línea 1 de dirección"
            required
          />
          <input
            type="text"
            name="address2"
            value={form.address2}
            onChange={handleChange}
            placeholder="Línea 2 de dirección (opcional)"
          />

          <div className="row">
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Código postal"
              required
            />
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ciudad"
              required
            />
          </div>

          <input
            type="text"
            name="province"
            value={form.province}
            onChange={handleChange}
            placeholder="Provincia"
          />

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="saveInfo"
                checked={form.saveInfo}
                onChange={handleChange}
              />
              Guarda mis datos para una compra más rápida
            </label>
            <label>
              <input
                type="checkbox"
                name="company"
                checked={form.company}
                onChange={handleChange}
              />
              Estoy comprando como empresa
            </label>
          </div>

          <p className="terms">
            Al suscribirte, aceptas las condiciones y política de privacidad de Team Finder.
          </p>

          <button type="submit" className="subscribe-btn">
            Suscribirse
          </button>

          <p className="footer-text">Powered by Stripe | Condiciones | Privacidad</p>
        </form>
      </div>
    </div>
  );
}

export default MetodoPagoBronce;