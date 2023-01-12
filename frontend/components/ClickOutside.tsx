import React, { useRef, useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';

interface Props {
  children: ReactNode;
  handleClick: () => void;
}

function useOutsideAlerter(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  handleClick: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

function OutsideAlerter(props: Props) {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, props.handleClick);

  return (
    <div className="clickoutside" ref={wrapperRef}>
      {props.children}
    </div>
  );
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
};

export default OutsideAlerter;
