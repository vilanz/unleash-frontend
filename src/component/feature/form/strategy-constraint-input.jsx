import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Textfield, IconButton, Tooltip, Icon } from 'react-mdl';
import Select from './select';

// TODO: these needs to be configurable.
const contextNames = ['environment', 'userId', 'appName'];
const constraintOperators = [{ key: 'IN', label: 'IN' }, { key: 'NOT_IN', label: 'NOT_IN' }];

const constraintContextNames = contextNames.map(c => ({ key: c, label: c }));

export default class StrategyConstraintInput extends Component {
    static propTypes = {
        strategy: PropTypes.object.isRequired,
        updateStrategy: PropTypes.func.isRequired,
        handleConfigChange: PropTypes.func.isRequired,
    };

    setConfig = (key, value) => {
        const parameters = this.props.strategy.parameters || {};
        parameters[key] = value;

        const updatedStrategy = Object.assign({}, this.props.strategy, {
            parameters,
        });

        this.props.updateStrategy(updatedStrategy);
    };

    addConstraint = evt => {
        evt.preventDefault();
        const { strategy, updateStrategy } = this.props;

        const constraints = strategy.constraints ? [...strategy.constraints] : [];

        // TOOD: value should be array
        constraints.push({ contextName: contextNames[0], operator: 'IN', value: [] });

        const updatedStrategy = Object.assign({}, strategy, {
            constraints,
        });

        updateStrategy(updatedStrategy);
    };

    removeConstraint = (index, evt) => {
        evt.preventDefault();
        const { strategy, updateStrategy } = this.props;

        const constraints = [...strategy.constraints];
        constraints.splice(index, 1);

        const updatedStrategy = Object.assign({}, strategy, {
            constraints,
        });

        updateStrategy(updatedStrategy);
    };

    updateConstraint = (value, index, field) => {
        const { strategy, updateStrategy } = this.props;
        const constraints = strategy.constraints || [];

        // TOOD: value should be array
        const constraint = strategy.constraints[index];

        constraint[field] = value;

        const updatedStrategy = Object.assign({}, strategy, {
            constraints,
        });

        updateStrategy(updatedStrategy);
    };

    renderConstraint(constraint, index) {
        return (
            <tr key={`${constraint.contextName}-${index}`}>
                <td>
                    <Select
                        name="contextName"
                        label="Context Field"
                        options={constraintContextNames}
                        value={constraint.contextName}
                        onChange={evt => this.updateConstraint(evt.target.value, index, 'contextName')}
                        style={{ width: 'auto' }}
                    />
                </td>
                <td>
                    <Select
                        name="operator"
                        label="Operator"
                        options={constraintOperators}
                        value={constraint.operator}
                        onChange={evt => this.updateConstraint(evt.target.value, index, 'operator')}
                        style={{ width: 'auto' }}
                    />
                </td>
                <td style={{ width: '100%' }}>
                    <Textfield
                        floatingLabel
                        value={constraint.values ? constraint.values.join(',') : ''}
                        onChange={evt => this.updateConstraint(evt.target.value.split(','), index, 'values')}
                        label="Values (v1, v2, v3)"
                        style={{ width: '100%' }}
                    />
                </td>
                <td>
                    <IconButton name="delete" onClick={this.removeConstraint.bind(this, index)} />
                </td>
            </tr>
        );
    }

    render() {
        const { strategy } = this.props;
        const constraints = strategy.constraints || [];

        return (
            <div>
                <h5>
                    {'Constraints '}
                    <Tooltip label={<span>Use context fields to constrain the activation strategy.</span>}>
                        <Icon name="info" style={{ fontSize: '0.9em', color: 'gray' }} />
                    </Tooltip>
                </h5>
                <table>
                    <tbody>{constraints.map((c, i) => this.renderConstraint(c, i))}</tbody>
                </table>
                <p>
                    <a href="#add-constraint" title="Add constraint" onClick={this.addConstraint}>
                        Add constraint
                    </a>
                </p>
            </div>
        );
    }
}
