import { useState } from 'react';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import { FiSettings } from 'react-icons/fi';
import { MdPersonAddAlt } from 'react-icons/md';
import { Inter } from '@next/font/google';
import Modal from './modal';

const inter = Inter({ subsets: ['latin'] });

const MuiPopper = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <PopupState variant="popper" popupId="popup-popper">
        {popupState => (
          <div>
            <FiSettings {...bindToggle(popupState)} />

            <Popper {...bindPopper(popupState)} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper className="popper">
                    <button
                      className={`popper-item ${inter.className}`}
                      onClick={() => setOpenModal(true)}
                    >
                      <MdPersonAddAlt /> <span>Add group member(s)</span>
                    </button>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>
        )}
      </PopupState>
      <Modal open={openModal} handleClose={() => setOpenModal(false)} />
    </>
  );
};

export default MuiPopper;
