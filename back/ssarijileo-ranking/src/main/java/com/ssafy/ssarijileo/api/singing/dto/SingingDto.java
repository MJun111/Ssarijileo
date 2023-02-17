package com.ssafy.ssarijileo.api.singing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SingingDto {

    // PK (AUTO_INCREMENT)
    Long singingId;

    Long songId;

    String singingTime;

    String state;

}
