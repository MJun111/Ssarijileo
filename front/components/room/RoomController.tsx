import React, { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/room/RoomController.module.scss';

import PitchController from './PitchController';
import BeatController from './BeatController';
import VolumeController from './VolumeController';

function RoomController({ setModalOpen }: any) {
  const [picthModalOpen, setPicthModalOpen] = useState(false);
  const [beatModalOpen, setBeatModalOpen] = useState(false);
  const [volumeModalOpen, setVolumeModalOpen] = useState(false);
  // const [settingModalOpen, setSettingModalOpen] = useState(false);
  return (
    <div className={styles.layout}>
      <input
        type="button"
        className={styles.back}
        onClick={() => {
          setModalOpen(false);
        }}
      />
      <div className={styles.container}>
        <div className={styles.pitch}>
          <Image
            src="img/ssari/ssari_pitch_image.svg"
            width={72}
            height={72}
            alt="pitch"
            className={styles.icon}
            onClick={() => {
              setPicthModalOpen(!picthModalOpen);
            }}
          />
          <div className={styles.context}>음정</div>
        </div>
        <div className={styles.beat}>
          <Image
            src="img/ssari/ssari_beat_image.svg"
            width={72}
            height={72}
            alt="beat"
            className={styles.icon}
            onClick={() => {
              setBeatModalOpen(!beatModalOpen);
            }}
          />
          <div className={styles.context}>박자</div>
        </div>
        <div className={styles.volume}>
          <Image
            src="img/ssari/ssari_volume_image.svg"
            width={72}
            height={72}
            alt="volume"
            className={styles.icon}
            onClick={() => {
              setVolumeModalOpen(!volumeModalOpen);
            }}
          />
          <div className={styles.context}>볼륨</div>
        </div>
        <div className={styles.musicNote}>
          <Image
            src="img/ssari/ssari_camera_image.svg"
            width={72}
            height={72}
            alt="camera"
            className={styles.icon}
          />
          <div className={styles.context}>카메라 ON/OFF</div>
        </div>
        <div className={styles.jump}>
          <Image
            src="img/ssari/ssari_mic_image.svg"
            width={72}
            height={72}
            alt="mic"
            className={styles.icon}
          />
          <div className={styles.context}>마이크 ON/OFF</div>
        </div>
        <Image
          src="img/ssari/ssari_setting_image.svg"
          width={52}
          height={52}
          alt="pitch"
          className={styles.setting}
        />
        {picthModalOpen && (
          <PitchController setPitchModal={setPicthModalOpen} />
        )}
        {beatModalOpen && <BeatController setBeatModal={setBeatModalOpen} />}
        {volumeModalOpen && (
          <VolumeController setVolumeModal={setVolumeModalOpen} />
        )}
      </div>
    </div>
  );
}

export default RoomController;
