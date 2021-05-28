# lode Benchmark

The benchmark expects `../demo` project to be running.

The benchmark will automatically run a number of samples, to customize the amount of samples, pass `--iterations=n`.
As the benchmark will finish after a given timeout to prevent endless runs, you can pass `--timeout=n` in ms which defaults to 20'000.
The benchmark can be run in a headless environment. It's not advised to do so as the result is not reliable. If this is desired (e.g. for testing purposes on CI) you can pass `--headless`.

By default the benchmark will only show the report. In order to show more detailed information which is helpful for debugging pass `--logDetails`.
This will log more information from the demo scene.

## Dev
Run `yarn setup` to get up and running and then `yarn start`
**Note**: The `../demo` project needs to be running as well.