using Data.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace Data.Utils
{
    public class Util
    {

        public static object Users { get; private set; }

        public static int? checkTokenApp(string token)
        {
            DEKKOEntities cnn = new DEKKOEntities();
            Customer customer = cnn.Customers.Where(u => u.Token.Equals(token) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
            if (customer != null && token.Length > 0)
            {
                return customer.ID;
            }
            else
                return null;

        }

        //public static int? checkTokenWeb(string tocken)
        //{
        //    User users = Connect.Users.Where(u => u.Token.Equals(tocken) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
        //    if (users != null)
        //    {
        //        return users.UserID;
        //    }
        //    else
        //        return null;
        //}

        public static string CreateMD5(string input)
        {
            //bam du lieu
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                System.Text.StringBuilder sb = new System.Text.StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }
        public static string CheckNullString(string input)
        {
            string output = "";
            try
            {
                output = input.ToString();
            }
            catch
            {

            }
            return output;
        }
        private static readonly string[] VietNamChar = new string[]
{
        "aAeEoOuUiIdDyY",
        "áàạảãâấầậẩẫăắằặẳẵ",
        "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
        "éèẹẻẽêếềệểễ",
        "ÉÈẸẺẼÊẾỀỆỂỄ",
        "óòọỏõôốồộổỗơớờợởỡ",
        "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
        "úùụủũưứừựửữ",
        "ÚÙỤỦŨƯỨỪỰỬỮ",
        "íìịỉĩ",
        "ÍÌỊỈĨ",
        "đ",
        "Đ",
        "ýỳỵỷỹ",
        "ÝỲỴỶỸ"
};
        public static string Converts(string str)
        {
            //Thay thế và lọc dấu từng char      
            for (int i = 1; i < VietNamChar.Length; i++)
            {
                for (int j = 0; j < VietNamChar[i].Length; j++)
                    str = str.Replace(VietNamChar[i][j], VietNamChar[0][i - 1]);
            }
            return str;
        }
        public static string RandomString(int size, bool lowerCase)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            if (lowerCase)
                return builder.ToString().ToLower();
            else
                return builder.ToString().ToUpper();
        }
        public static int RandomNumber(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }
        public static string ConvertPhone(string phonenumber)
        {
            if (phonenumber.Contains("+84"))
            {
                int length = phonenumber.Length - 3;
                phonenumber = "0" + phonenumber.Substring(3, length);
            }
            return phonenumber;
        }

        /// <summary>
        /// Code SeriCard
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string Code(string text)
        {
            char[] charArr = text.ToCharArray();
            byte[] input = Encoding.ASCII.GetBytes(charArr);
            List<string> lsoutput = new List<string>();
            foreach (byte by in input)
            {
                int value = (int)((by * SystemParam.KeyA) % SystemParam.KeyB + SystemParam.KeyC);
                string valuestr = Encoding.ASCII.GetString(new byte[] { (byte)value });
                lsoutput.Add(valuestr);
            }
            int balance1 = (int)((48 * SystemParam.KeyA) / SystemParam.KeyB);
            int balance2 = (int)((57 * SystemParam.KeyA) / SystemParam.KeyB);
            lsoutput.Add("!" + balance1.ToString());
            lsoutput.Add("!" + balance2.ToString());
            string output = DateTime.Now.ToString("HHyyyyssddmmMM!");
            foreach (string o in lsoutput)
            {
                output += o;
            }
            return output;
        }
        /// <summary>
        /// EnCode Card   
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string EnCode(string text)
        {
            string[] lsString = text.Split('!');
            string inputstr = lsString[lsString.Length - 3];
            int balance1 = int.Parse(lsString[lsString.Length - 2]);
            int balance2 = int.Parse(lsString[lsString.Length - 1]);
            char[] charArr = inputstr.ToCharArray();
            byte[] input = Encoding.ASCII.GetBytes(charArr);
            string lsoutput = "";
            foreach (byte c in input)
            {
                float value = (c - SystemParam.KeyC + SystemParam.KeyB * balance1) / SystemParam.KeyA;
                if (value < 48 || value > 57 || value != (int)value)
                    value = (c - SystemParam.KeyC + SystemParam.KeyB * balance2) / SystemParam.KeyA;
                string output = Encoding.ASCII.GetString(new byte[] { (byte)value });
                lsoutput += output;
            }
            return lsoutput;
        }


        //Convert Datetime 
        public static  Nullable<DateTime> ConvertDate(string date)
        {
            if (date != "")
            {
                try
                {
                    string datetime = date.Replace("-", "/"); 
                    string[] arr = datetime.Split('/');
                    DateTime dateTime = new DateTime(int.Parse(arr[2]), int.Parse(arr[1]), int.Parse(arr[0]));
                    return dateTime;
                }
                catch
                {
                    return null;
                }
            }
            else
                return null;
        }

        //get name TYPE_ADD 
        public static string GetNameType(int ID)
        {
            string result = "";
            switch (ID)
            {
                case 1: result = "Tích điểm"; break;
                case 2: result = "Tặng điểm"; break;
                case 3: result = "Được tặng điểm"; break;
                case 4: result = "Đổi quà"; break;
                case 5: result = "Hệ thống cộng điểm"; break;
                case 6: result = "Đổi thẻ"; break;
                case 7: result = "Hủy yêu cầu đổi quà"; break;
            }
            return result;
        }

        public static string GetNameStatusWarranty(int Status)
        {
            string result = "";
            switch (Status)
            {
                case 1: result = "Đã tích điểm"; break;
                case 2: result = "Chưa tích điểm"; break;
            }
            return result;
        }

    }

}
