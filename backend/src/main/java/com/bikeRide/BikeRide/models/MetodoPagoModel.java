package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table (name="METODO_PAGO")
public class MetodoPagoModel {

    @Id
    @GeneratedValue (strategy=GenerationType.IDENTITY)
    private Long idMetodoPago;

    private String tipo;
    private String detalleMetodo;
    private String token;


    public Long getIdMetodoPago() {
        return idMetodoPago;
    }

    public void setIdMetodoPago(Long idMetodoPago) {
        this.idMetodoPago = idMetodoPago;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDetalleMetodo() {
        return detalleMetodo;
    }

    public void setDetalleMetodo(String detalleMetodo) {
        this.detalleMetodo = detalleMetodo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    
}
