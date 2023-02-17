package com.ssafy.ssarijileo.api.singing.repsoitory;

import com.ssafy.ssarijileo.api.singing.entity.Singing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SingingJpaRepository extends JpaRepository<Singing, Long> {

    List<Singing> findBySingingDateBetween(String startDate, String endDate);

}
