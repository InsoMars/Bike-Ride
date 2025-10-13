package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "BICICLETA")
public class BicicletaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBicicleta;
    private String numSerie;
    
    @ManyToOne
    @JoinColumn (name= "idTipoBicicleta", nullable= false)
    private TipoBicicletaModel tipoBicicleta;


    @ManyToOne
    @JoinColumn (name= "idEstacion", nullable= false)
    private EstacionModel estacion;

    public Long getIdBicicleta() {
        return idBicicleta;
    }

    public void setIdBicicleta(Long idBicicleta) {
        this.idBicicleta = idBicicleta;
    }

    public String getNumSerie() {
        return numSerie;
    }

    public void setNumSerie(String numSerie) {
        this.numSerie = numSerie;
    }

    public TipoBicicletaModel getTipoBicicleta() {
        return tipoBicicleta;
    }

    public void setTipoBicicleta(TipoBicicletaModel tipoBicicleta) {
        this.tipoBicicleta = tipoBicicleta;
    }

    public EstacionModel getEstacion() {
        return estacion;
    }

    public void setEstacion(EstacionModel estacion) {
        this.estacion = estacion;
    }





    
}
