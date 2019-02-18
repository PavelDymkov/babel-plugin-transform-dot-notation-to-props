# babel-plugin-transform-dot-notation-to-props

## Example

**In**

```javascript
<Foo>
    <Foo.bar>
        <Baz />
    </Foo.bar>
</Foo>
```

**Out**

```javascript
<Foo bar={<Baz />} />
```

## Installation

```sh
npm install --save-dev babel-plugin-transform-dot-notation-to-props
```

## Usage

**.babelrc**

```json
{
  "plugins": ["babel-plugin-transform-dot-notation-to-props"]
}
```

## Options

### `ignoreCapitalizedProps`

`boolean`, defaults to `false`.
