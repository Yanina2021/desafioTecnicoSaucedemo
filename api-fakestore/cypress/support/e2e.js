import Ajv from 'ajv';
import './commands';

const ajv = new Ajv({ allErrors: true });

chai.Assertion.addMethod('matchSchema', function (schema) {
  const validate = ajv.compile(schema);
  const valid = validate(this._obj);
  this.assert(
    valid,
    `expected response to match schema: ${ajv.errorsText(validate.errors)}`,
    'expected response not to match schema'
  );
});
