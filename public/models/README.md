Keep the original high-detail export at:

```text
public/models/drone.source.glb
```

Ship the compressed production model at:

```text
public/models/drone.glb
```

If the model uses custom rotor mesh names, update `rotorNameKeywords` in
`src/components/drone/DroneModel.tsx` or add exact names there.

For production, compress the model with Draco. This keeps the named propeller
node transforms intact, which preserves the rotor spin origins:

```bash
npx @gltf-transform/cli draco public/models/drone.source.glb public/models/drone.glb --method edgebreaker --encode-speed 5 --decode-speed 5
```

The local decoder files live in:

```text
public/draco/
```
