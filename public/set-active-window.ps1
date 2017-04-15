param(
    [string]$process
)

$code=@'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

static public class Win32{
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    static public extern bool SetForegroundWindow(IntPtr hWnd);
}
'@
 Add-Type $code

$handles=(get-process -id $process).MainWindowHandle
$handles|%{[win32]::SetForegroundWindow($_)}
