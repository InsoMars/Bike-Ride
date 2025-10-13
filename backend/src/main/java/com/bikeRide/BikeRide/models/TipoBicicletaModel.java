package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "TIPO_BICICLETA")
public class TipoBicicletaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoBicicleta;
    private String tipo;
    
    
    public Long getIdTipoBicicleta() {
        return idTipoBicicleta;
    }

    public void setIdTipoBicicleta(Long idTipoBicicleta) {
        this.idTipoBicicleta = idTipoBicicleta;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }


    
    
}
