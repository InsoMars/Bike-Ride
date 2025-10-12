package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "SUSCRIPCION")

public class SuscripcionModel {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSuscripcion;

    private int cantViajesSuscripcion;

    @ManyToOne
    @JoinColumn (name= "idTipoSuscripcion", nullable= false)
    private TipoSuscripcionModel tipoSuscripcion;


    

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public int getCantViajesSuscripcion() {
        return cantViajesSuscripcion;
    }

    public void setCantViajesSuscripcion(int cantViajesSuscripcion) {
        this.cantViajesSuscripcion = cantViajesSuscripcion;
    }

    public TipoSuscripcionModel getTipoSuscripcion() {
        return tipoSuscripcion;
    }

    public void setTipoSuscripcion(TipoSuscripcionModel tipoSuscripcion) {
        this.tipoSuscripcion = tipoSuscripcion;
    }


    
}
