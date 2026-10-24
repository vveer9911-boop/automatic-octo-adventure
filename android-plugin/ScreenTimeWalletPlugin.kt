package app.screentimewallet.android

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Process
import android.os.SystemClock
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Native Android Capacitor Plugin for Screen Time Wallet APK.
 * Bridges UsageStatsManager, SYSTEM_ALERT_WINDOW overlay permissions,
 * DeviceAdmin uninstall guard, and monotonic SystemClock.elapsedRealtime().
 */
@CapacitorPlugin(name = "ScreenTimeWallet")
class ScreenTimeWalletPlugin : Plugin() {

    @PluginMethod
    fun checkPermissionsStatus(call: PluginCall) {
        val ctx = context
        val usageGranted = hasUsageStatsPermission(ctx)
        val overlayGranted = Settings.canDrawOverlays(ctx)

        val ret = JSObject()
        ret.put("usageStatsGranted", usageGranted)
        ret.put("overlayShieldGranted", overlayGranted)
        ret.put("monotonicElapsedMs", SystemClock.elapsedRealtime())
        call.resolve(ret)
    }

    @PluginMethod
    fun openUsageAccessSettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        call.resolve()
    }

    @PluginMethod
    fun openOverlaySettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        call.resolve()
    }

    private fun hasUsageStatsPermission(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }
}
