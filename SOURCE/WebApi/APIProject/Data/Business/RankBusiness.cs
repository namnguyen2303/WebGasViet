using Data.DB;
using Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Business
{
    public class RankBusiness : GenericBusiness
    {
        public RankBusiness(DEKKOEntities context = null) : base()
        {
        }

        public List<Ranking> LoadRank()
        {
            return cnn.Rankings.Where(p => p.IsActive == SystemParam.ACTIVE).ToList();
        }
        /*public int AddRank(int Level,string RankName, string Descriptions, int MinPoint, int MaxPoint)
        {
            Ranking newRank = new Ranking();
            newRank.Level = Level;
            newRank.RankName = RankName;
            newRank.Descriptions = Descriptions;
            newRank.MinPoint = MinPoint;
            newRank.MaxPoint = MaxPoint;
            newRank.IsActive = SystemParam.ACTIVE;
            newRank.CraeteDate = DateTime.Now;
            cnn.Rankings.Add(newRank);
            cnn.SaveChanges();
            return SystemParam.RETURN_TRUE;
        }*/

        public Ranking getRankByLever(int lv)
        {
            return cnn.Rankings.SingleOrDefault(x => x.Level == lv);
        }

        public Ranking ShowEditRank(int ID)
        {
            return cnn.Rankings.Find(ID);
        }

        public int EditRank(int ID, string Descripton, int? MaxPoint, int? MinPoint)
        {
            try
            {
                //var Level = cnn.Rankings.Find(ID).Level;
                //int PointUp;
                //if (Level == 1)
                //{
                //    PointUp = MaxPoint.Value - MinPoint.Value;
                //}
                //else
                //{
                //    PointUp = MaxPoint.Value - MinPoint.Value + 1;
                //}
                //var editRank = cnn.Rankings.Select(x => x).ToList();
                //foreach (Ranking edit in editRank)
                //{
                //    if (edit.Level == 1)
                //    {
                //        edit.MinPoint = 0;
                //        edit.MaxPoint = PointUp;
                //    }
                //    else if(edit.Level == 4)
                //    {
                //        edit.MinPoint = PointUp * (edit.Level - 1) + 1;
                //        edit.MaxPoint = 99999999;
                //    }
                //    else
                //    {
                //        edit.MinPoint = PointUp * (edit.Level - 1) + 1;
                //        edit.MaxPoint = PointUp * edit.Level;
                //    }
                //}
                //var editDescription = cnn.Rankings.Where(x => x.Level == Level).SingleOrDefault();
                //editDescription.Descriptions = Descripton;
                List<Ranking> lsRank = cnn.Rankings.Where(u => u.IsActive.Equals(SystemParam.ACTIVE)).ToList();
                Ranking curentRank = lsRank.Find(u => u.ID.Equals(ID));
                int level = curentRank.Level.Value;
                if (level != 1 && MinPoint <= 1)
                    return SystemParam.RETURN_FALSE;
                if (level == 1 && MinPoint != 0)
                    return SystemParam.RETURN_FALSE;
                else
                {
                    curentRank.MinPoint = MinPoint;
                    if (level != 4)
                        curentRank.MaxPoint = MaxPoint;
                    Ranking upRank = lsRank.Where(u => u.Level.Value.Equals(level + 1) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
                    Ranking downRank = lsRank.Where(u => u.Level.Value.Equals(level - 1) && u.IsActive.Equals(SystemParam.ACTIVE)).FirstOrDefault();
                    if (upRank != null)
                    {
                        if (MaxPoint + 1 >= upRank.MaxPoint)
                            return SystemParam.RETURN_FALSE;
                        upRank.MinPoint = MaxPoint + 1;
                    }
                    if (downRank != null)
                    {
                        if (MinPoint - 1 <= downRank.MinPoint)
                            return SystemParam.RETURN_FALSE;
                        downRank.MaxPoint = MinPoint - 1;
                    }
                    cnn.SaveChanges();
                    return SystemParam.RETURN_TRUE;
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return SystemParam.RETURN_FALSE;
            }
        }

        /*public int DeleteRank(int ID)
        {
            try
            {
                var cusDel = cnn.Rankings.Find(ID);
                cusDel.IsActive = SystemParam.ACTIVE_FALSE;
                cnn.SaveChanges();
                return SystemParam.RETURN_TRUE;
            }
            catch (Exception)
            {
                return SystemParam.RETURN_FALSE;
            }
        }*/
    }
}
