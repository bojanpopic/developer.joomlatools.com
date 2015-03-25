# Behaviors

All Joomlatools extensions use **Behaviors** to separate out pieces of functionality into re-usable pieces. This helps keep from writing the same functionality over and over again. The major areas where this technique is employed in the Framework are the MVC, Dispatcher and Database layer.

In fact, **Behaviors** respond to the same major actions that the [Plugins](./plugins.md) do as we discussed in the last section. The [MVC Actions and Events](./plugins.md#mvc-actions-and-events) section has a useful table with the methods that before and after command chains are fired for in the MVC layer.
