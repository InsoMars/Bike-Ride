package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TIPO_VIAJE")

public class TipoViajeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoViaje;

    private String tipoViaje;
    private int duracionMin;
    private long tarifaBase;
    private long tarifaExtra;
    

    public Long getIdTipoViaje() {
        return idTipoViaje;
    }

    public void setIdTipoViaje(Long idTipoViaje) {
        this.idTipoViaje = idTipoViaje;
    }

    public String getTipoViaje() {
        return tipoViaje;
    }

    public void setTipoViaje(String tipoViaje) {
        this.tipoViaje = tipoViaje;
    }

    public int getDuracionMin() {
        return duracionMin;
    }

    public void setDuracionMin(int duracionMin) {
        this.duracionMin = duracionMin;
    }

    public long getTarifaBase() {
        return tarifaBase;
    }

    public void setTarifaBase(long tarifaBase) {
        this.tarifaBase = tarifaBase;
    }

    public long getTarifaExtra() {
        return tarifaExtra;
    }

    public void setTarifaExtra(long tarifaExtra) {
        this.tarifaExtra = tarifaExtra;
    }

    

    
    
}
