package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "CATEGORIA_ESTACION")
public class CategoriaEstacionModel {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long idCategoriaEstacion;

private String tipo;

    public Long getIdCategoriaEstacion() {
        return idCategoriaEstacion;
    }

    public void setIdCategoriaEstacion(Long idCategoriaEstacion) {
        this.idCategoriaEstacion = idCategoriaEstacion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }







    
}
