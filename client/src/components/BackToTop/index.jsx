import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Icon } from '@chakra-ui/react';
import { FaAngleUp } from 'react-icons/fa';

BackToTop.propTypes = {
  showBelow: PropTypes.number,
};

BackToTop.defaultProps = {
  showBelow: 250,
};

function BackToTop(props) {
  const { showBelow } = props;
  const [show, setShow] = useState(showBelow ? false : true);

  const handleScroll = () => {
    if (window.pageYOffset > showBelow) {
      if (!show) setShow(true);
    } else {
      if (show) setShow(false);
    }
  };

  useEffect(() => {
    if (showBelow) {
      window.addEventListener(`scroll`, handleScroll);
      return () => window.removeEventListener(`scroll`, handleScroll);
    }
  });

  const _onClick = () => {
    window[`scrollTo`]({ top: 0, behavior: `smooth` })
  };

  return (
    <Box>
      {show &&
        <Button
          borderRadius={'100%'}
          padding='0'
          w={'12'}
          h={'12'}
          backgroundColor='blue.400'
          onClick={_onClick}
          zIndex='2'
          position={'fixed'}
          bottom='2vh'
          boxShadow={'0px 1px 20px #fff'}
          right='3%'
          _hover={{
            transition: '1s',
            backgroundColor: 'blue.200'
          }}
        >
          <Icon
            as={FaAngleUp}
            w='10'
            h='10'
            color={'white'}
          />
        </Button>
      }
    </Box>
  );
}

export default BackToTop;
