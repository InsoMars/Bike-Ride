package com.bikeRide.BikeRide.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bikeRide.BikeRide.models.RolModel;

@Repository
public interface RolRepository extends JpaRepository<RolModel, Long> {


}
