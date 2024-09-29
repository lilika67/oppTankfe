// ignore_for_file: use_key_in_widget_constructors, prefer_const_constructors

import 'package:flutter/material.dart';
import 'temperature.dart';

class TemperatureApp extends StatefulWidget {
  @override
  _TemperatureAppState createState() => _TemperatureAppState();
}

class _TemperatureAppState extends State<TemperatureApp> {
  bool _isTitleLarge = true;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color.fromARGB(255, 255, 105, 180),
          title: Center(
            child: AnimatedSwitcher(
              duration: Duration(seconds: 1),
              transitionBuilder: (Widget child, Animation<double> animation) {
                return ScaleTransition(scale: animation, child: child);
              },
              child: Text(
                _isTitleLarge ? 'Temperature Conversion app' : 'Converter',
                key: ValueKey<String>(_isTitleLarge ? 'Temperature Conversion app' : 'Converter'),
                style: TextStyle(
                  color: Colors.black,
                  fontSize: _isTitleLarge ? 20 : 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          actions: [
            IconButton(
              icon: Icon(Icons.refresh),
              onPressed: () {
                setState(() {
                  _isTitleLarge = !_isTitleLarge; // Toggle title size
                });
              },
            ),
          ],
        ),
        body: Center(child: TemperatureScreen()),
      ),
    );
  }
}

void main() {
  runApp(TemperatureApp());
}
