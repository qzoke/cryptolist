import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getNewPath } from '../../../../../library/path-tools';

const getBlockPath = blockHash => {
  return getNewPath(window.location.pathname, '/*/*/blocks', {
    block: blockHash || undefined,
  });
};

export const BlockInfo = ({ block }) => {
  return (
    <div className="block-info">
      <div className="row">
        <div className="col-md-6">
          <div className="table">
            <div className="item">
              <div className="label">Date</div>
              <div className="value">{moment(block.date).format('LLLL')}</div>
            </div>
            <div className="item">
              <div className="label">Time</div>
              <div className="value">{block.time}</div>
            </div>
            <div className="item">
              <div className="label">Height</div>
              <div className="value">{block.height}</div>
            </div>
            <div className="item">
              <div className="label">Difficulty</div>
              <div className="value">{block.difficulty}</div>
            </div>
            <div className="item">
              <div className="label">Version</div>
              <div className="value">{block.version}</div>
            </div>
            <div className="item">
              <div className="label">Size Bytes</div>
              <div className="value">{block.sizeBytes}</div>
            </div>
            <div className="item">
              <div className="label">Bits</div>
              <div className="value">{block.bits}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="table">
            <div className="item">
              <div className="label">Nonce</div>
              <div className="value">{block.nonce}</div>
            </div>
            <div className="item">
              <div className="label">Confirmations</div>
              <div className="value">{block.confirmations}</div>
            </div>
            <div className="item">
              <div className="label">Hash</div>
              <div className="value hash">{block.hash}</div>
            </div>
            <div className="item">
              <div className="label">Previous</div>
              <div className="value hash">
                <Link to={getBlockPath(block.prevHash)}>{block.prevHash}</Link>
              </div>
            </div>
            <div className="item">
              <div className="label">Next</div>
              <div className="value hash">
                {<Link to={getBlockPath(block.nextHash)}>{block.nextHash}</Link> || 'None'}
              </div>
            </div>
            <div className="item">
              <div className="label">Merkle Root</div>
              <div className="value hash">{block.merkleRoot}</div>
            </div>
            <div className="item">
              <div className="label">Transaction Count</div>
              <div className="value">{block.txCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BlockInfo.propTypes = {
  block: PropTypes.object,
};
