package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "FIDELIZACION")

public class FidelizacionModel {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFidelizacion;
    private int cantViajesRealizados;
    private int puntosActuales;

    @OneToOne
    @JoinColumn (name= "idCliente", nullable= false)
    private PerfilClienteModel cliente;


    

    public Long getIdFidelizacion() {
        return idFidelizacion;
    }

    public void setIdFidelizacion(Long idFidelizacion) {
        this.idFidelizacion = idFidelizacion;
    }

    public int getCantViajesRealizados() {
        return cantViajesRealizados;
    }

    public void setCantViajesRealizados(int cantViajesRealizados) {
        this.cantViajesRealizados = cantViajesRealizados;
    }

    public int getPuntosActuales() {
        return puntosActuales;
    }

    public void setPuntosActuales(int puntosActuales) {
        this.puntosActuales = puntosActuales;
    }

    public PerfilClienteModel getCliente() {
        return cliente;
    }

    public void setCliente(PerfilClienteModel cliente) {
        this.cliente = cliente;
    }


    

    
}
